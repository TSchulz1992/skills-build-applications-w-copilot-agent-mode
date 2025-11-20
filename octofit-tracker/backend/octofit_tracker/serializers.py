from rest_framework import serializers
from .models import User, Team, Activity, Workout, Leaderboard

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team', 'team_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with validation"""
    
    class Meta:
        model = User
        fields = ['name', 'email', 'team']
    
    def validate_email(self, value):
        """Validate that email is unique and properly formatted"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        if not '@' in value:
            raise serializers.ValidationError("Please enter a valid email address.")
        return value.lower()
    
    def validate_name(self, value):
        """Validate that name is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_name', 'type', 'duration', 'date']

class ActivityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating activities with validation"""
    
    class Meta:
        model = Activity
        fields = ['user', 'type', 'duration', 'date']
    
    def validate_duration(self, value):
        """Validate that duration is positive"""
        if value <= 0:
            raise serializers.ValidationError("Duration must be greater than 0.")
        if value > 1440:  # 24 hours in minutes
            raise serializers.ValidationError("Duration cannot exceed 24 hours (1440 minutes).")
        return value
    
    def validate_type(self, value):
        """Validate activity type"""
        valid_types = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Gym', 'Walking', 'Other']
        if value not in valid_types:
            raise serializers.ValidationError(f"Activity type must be one of: {', '.join(valid_types)}")
        return value

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'team_name', 'points']
