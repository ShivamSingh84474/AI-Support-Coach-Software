import unittest

from support_coach import AISupportCoach


class AISupportCoachTests(unittest.TestCase):
    def setUp(self):
        self.coach = AISupportCoach()

    def test_empty_message_requests_context(self):
        reply = self.coach.coach("  ")
        self.assertEqual(reply.tone, "neutral")
        self.assertIn("share the customer issue", reply.message)

    def test_negative_message_uses_empathetic_tone(self):
        reply = self.coach.coach("Customer is very frustrated and angry")
        self.assertEqual(reply.tone, "empathetic")
        self.assertIn("Acknowledge", reply.message)

    def test_regular_message_uses_supportive_tone(self):
        reply = self.coach.coach("Need help resetting password")
        self.assertEqual(reply.tone, "supportive")
        self.assertIn("Confirm understanding", reply.message)


if __name__ == "__main__":
    unittest.main()
