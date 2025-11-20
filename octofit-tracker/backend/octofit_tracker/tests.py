from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelTests(TestCase):
    def setUp(self):
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')
        user1 = User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel)
        user2 = User.objects.create(name='Batman', email='batman@dc.com', team=dc)
        Activity.objects.create(user=user1, type='Running', duration=30, date='2025-11-20')
        Workout.objects.create(name='Hero Training', description='Intense workout for heroes')
        Leaderboard.objects.create(team=marvel, points=100)
        Leaderboard.objects.create(team=dc, points=80)

    def test_user_email_unique(self):
        marvel = Team.objects.get(name='Marvel')
        with self.assertRaises(Exception):
            User.objects.create(name='Duplicate', email='ironman@marvel.com', team=marvel)

    def test_leaderboard_points(self):
        marvel = Team.objects.get(name='Marvel')
        lb = Leaderboard.objects.get(team=marvel)
        self.assertEqual(lb.points, 100)
