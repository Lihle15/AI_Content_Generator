import os
from typing import Optional

from openai import OpenAI


CONTENT_TYPE_GUIDANCE = {
    "Social Post": "Write a scroll-stopping social post with a strong hook, body, and a clear call to action. Keep it concise and ready to publish.",
    "Blog Outline": "Produce a structured blog outline with a working title, introduction angle, H2/H3 sections, and suggested takeaways.",
    "Email": "Write a complete email with a subject line, preview text, greeting, body, and closing CTA.",
    "Ad Copy": "Write conversion-focused ad copy with a headline, supporting lines, and a CTA. Emphasize benefits over features.",
}

TONE_GUIDANCE = {
    "Conversational": "Warm, natural, and approachable. Sound like a trusted peer.",
    "Bold": "Confident, high-energy, and decisive. Lead with strong claims.",
    "Professional": "Clear, credible, and polished. Stay precise and respectful.",
    "Witty": "Smart, lightly playful, and memorable without undermining the message.",
}

PLATFORM_GUIDANCE = {
    "Instagram": "Optimize for Instagram: visual language, short paragraphs, and optional hashtag suggestions at the end.",
    "LinkedIn": "Optimize for LinkedIn: professional framing, scannable lines, and thought-leadership value.",
    "Twitter/X": "Optimize for Twitter/X: punchy lines, tight wording, and a format that can work as a single post or a short thread.",
}


class ContentGenerator:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "").strip()
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def generate(self, topic: str, content_type: str, tone: str, platform: str) -> str:
        if not self.client:
            return self._mock_generate(topic, content_type, tone, platform)

        prompt = self._build_prompt(topic, content_type, tone, platform)
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert content strategist and copywriter. "
                        "Return only the finished content. Do not mention models, APIs, or internal tools."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.8,
        )
        return (response.choices[0].message.content or "").strip()

    def _build_prompt(self, topic: str, content_type: str, tone: str, platform: str) -> str:
        content_guide = CONTENT_TYPE_GUIDANCE.get(content_type, CONTENT_TYPE_GUIDANCE["Social Post"])
        tone_guide = TONE_GUIDANCE.get(tone, TONE_GUIDANCE["Conversational"])
        platform_guide = PLATFORM_GUIDANCE.get(platform, PLATFORM_GUIDANCE["Instagram"])

        return (
            f"Topic: {topic.strip()}\n"
            f"Content type: {content_type}\n"
            f"Tone: {tone}\n"
            f"Platform: {platform}\n\n"
            f"{content_guide}\n"
            f"Tone direction: {tone_guide}\n"
            f"Platform direction: {platform_guide}\n"
            "Do not use emojis unless the topic itself requires a symbol."
        )

    def _mock_generate(self, topic: str, content_type: str, tone: str, platform: str) -> str:
        headline = topic.strip() or "your next campaign"
        voice = tone.lower()

        if content_type == "Blog Outline":
            return (
                f"Working title: {headline.title()} — A {voice} guide for {platform}\n\n"
                "Introduction\n"
                f"- Open with the tension your audience feels around {headline}.\n"
                f"- Promise a clear, {voice} take they can use immediately.\n\n"
                "1. Why this matters now\n"
                "- Name the shift in attention, demand, or behavior.\n"
                "- Show what happens if they wait.\n\n"
                "2. The core idea\n"
                f"- Distill {headline} into one memorable principle.\n"
                "- Support it with a practical example.\n\n"
                "3. How to put it into practice\n"
                "- Step 1: Clarify the offer.\n"
                "- Step 2: Shape the message for the platform.\n"
                "- Step 3: Publish, measure, refine.\n\n"
                "Close\n"
                "- Recap the takeaway.\n"
                "- Invite the reader to try one action this week."
            )

        if content_type == "Email":
            return (
                f"Subject: {headline.title()} that actually converts\n"
                "Preview: A sharper message, written for the way people read today.\n\n"
                "Hi there,\n\n"
                f"If {headline} has been sitting on your list, this is the moment to make it land.\n\n"
                f"This {voice} note is written for {platform}: lead with the benefit, keep the path short, "
                "and give people one obvious next step.\n\n"
                "Here is the move:\n"
                "1. Name the outcome in the first line.\n"
                "2. Prove it with one concrete detail.\n"
                "3. Ask for a single action.\n\n"
                "Ready to ship it?\n"
                "Reply with yes and we will refine the next draft together.\n\n"
                "Best,\n"
                "The content studio"
            )

        if content_type == "Ad Copy":
            return (
                f"Headline: Turn {headline} into attention you can keep\n\n"
                f"Primary text ({platform}, {voice})\n"
                f"Most campaigns talk about {headline}. This one makes people feel the result.\n\n"
                "Supporting line\n"
                "Clear promise. Tight wording. A reason to click now, not later.\n\n"
                "Call to action\n"
                "Start creating"
            )

        return (
            f"{headline.title()} does not need more noise. It needs a {voice} message that stops the scroll on {platform}.\n\n"
            "Lead with the outcome. Say it plainly. Then give your audience one reason to care and one reason to act.\n\n"
            "Hook: Stop posting more. Start posting what people remember.\n"
            f"Body: {headline} becomes useful when the copy is specific, the tone is consistent, and the next step is obvious.\n"
            "CTA: Draft your next post now.\n\n"
            "Suggested close: Save this, then publish the sharper version today."
        )
