from dataclasses import dataclass


@dataclass(frozen=True)
class CoachingReply:
    """Structured coaching reply for support responses."""

    tone: str
    message: str


class AISupportCoach:
    """A minimal AI support coach that suggests support-ready replies."""

    _NEGATIVE_SIGNALS = {"angry", "frustrated", "upset", "blocked", "urgent"}

    def coach(self, customer_message: str) -> CoachingReply:
        text = (customer_message or "").strip()
        if not text:
            return CoachingReply(
                tone="neutral",
                message="Please share the customer issue so I can suggest a response.",
            )

        lowered = text.lower()
        if any(signal in lowered for signal in self._NEGATIVE_SIGNALS):
            return CoachingReply(
                tone="empathetic",
                message=(
                    "Acknowledge the frustration, apologize briefly, and provide "
                    "a concrete next step with a clear timeline."
                ),
            )

        return CoachingReply(
            tone="supportive",
            message=(
                "Confirm understanding of the issue, share the immediate action "
                "you're taking, and invite follow-up questions."
            ),
        )
