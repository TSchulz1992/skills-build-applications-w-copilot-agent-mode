from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Lösche alle Daten
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Users
        ironman = User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel)
        captain = User.objects.create(name='Captain America', email='cap@marvel.com', team=marvel)
        thor = User.objects.create(name='Thor', email='thor@marvel.com', team=marvel)
        batman = User.objects.create(name='Batman', email='batman@dc.com', team=dc)
        superman = User.objects.create(name='Superman', email='superman@dc.com', team=dc)
        wonderwoman = User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc)

        # Activities
        Activity.objects.create(user=ironman, type='Running', duration=30, date='2025-11-20')
        Activity.objects.create(user=captain, type='Cycling', duration=45, date='2025-11-19')
        Activity.objects.create(user=thor, type='Swimming', duration=60, date='2025-11-18')
        Activity.objects.create(user=batman, type='Martial Arts', duration=50, date='2025-11-17')
        Activity.objects.create(user=superman, type='Flying', duration=120, date='2025-11-16')
        Activity.objects.create(user=wonderwoman, type='Running', duration=40, date='2025-11-15')

        # Workouts
        w1 = Workout.objects.create(name='Hero Training', description='Intense workout for heroes')
        w2 = Workout.objects.create(name='Power Session', description='Strength and endurance')
        w1.suggested_for.add(marvel, dc)
        w2.suggested_for.add(dc)

        # Leaderboard
        Leaderboard.objects.create(team=marvel, points=300)
        Leaderboard.objects.create(team=dc, points=250)

        self.stdout.write(self.style.SUCCESS('Testdaten erfolgreich erstellt!'))
