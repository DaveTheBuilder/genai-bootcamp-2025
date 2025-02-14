from django.core.management.base import BaseCommand
from vocabulary.models import Word, Group

class Command(BaseCommand):
    help = 'Creates test data for development'

    def handle(self, *args, **kwargs):
        # Create some words
        words_data = [
            {
                'spanish': 'casa',
                'english': 'house',
                'parts': {'type': 'noun', 'category': 'buildings', 'level': 'A1'}
            },
            {
                'spanish': 'perro',
                'english': 'dog',
                'parts': {'type': 'noun', 'category': 'animals', 'level': 'A1'}
            },
            {
                'spanish': 'gato',
                'english': 'cat',
                'parts': {'type': 'noun', 'category': 'animals', 'level': 'A1'}
            },
            {
                'spanish': 'comer',
                'english': 'to eat',
                'parts': {'type': 'verb', 'category': 'actions', 'level': 'A1'}
            },
            {
                'spanish': 'beber',
                'english': 'to drink',
                'parts': {'type': 'verb', 'category': 'actions', 'level': 'A1'}
            },
            {
                'spanish': 'grande',
                'english': 'big',
                'parts': {'type': 'adjective', 'category': 'descriptions', 'level': 'A1'}
            },
            {
                'spanish': 'pequeño',
                'english': 'small',
                'parts': {'type': 'adjective', 'category': 'descriptions', 'level': 'A1'}
            }
        ]

        created_words = []
        for data in words_data:
            word, created = Word.objects.get_or_create(
                spanish=data['spanish'],
                defaults={
                    'english': data['english'],
                    'parts': data['parts']
                }
            )
            created_words.append(word)
            if created:
                self.stdout.write(f'Created word: {word.spanish}')

        # Create some groups
        groups_data = [
            {'name': 'Basic Nouns', 'words': [w for w in created_words if w.parts['type'] == 'noun']},
            {'name': 'Common Verbs', 'words': [w for w in created_words if w.parts['type'] == 'verb']},
            {'name': 'Adjectives', 'words': [w for w in created_words if w.parts['type'] == 'adjective']},
        ]

        for data in groups_data:
            group, created = Group.objects.get_or_create(name=data['name'])
            if created:
                self.stdout.write(f'Created group: {group.name}')
            group.words.set(data['words'])

        self.stdout.write(self.style.SUCCESS('Successfully created test data')) 