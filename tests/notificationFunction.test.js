import {
  onCreateHabitNotification,
  onHabitExpirationNotification,
  onCreateMilestoneNotification,
  onMilestoneExpirationNotification
} from '../utilities';

describe('NOTIFICATION FUNCTION TEST SUITE', () => {
  describe('onCreate of a Habit Notification', () => {
    it('it will check the returned values on habit creation', () => {
      expect(onCreateHabitNotification('Coding')).toHaveProperty(
        'Title',
        'Description',
        'Habit Creation',
        'Coding has been created'
      );
    });
  });

  describe('onExpiration of a Habit Notification', () => {
    it('it will check the returned values on habit expiration', () => {
      expect(onHabitExpirationNotification('Coding', 21)).toHaveProperty(
        'Title',
        'Description',
        'Habit Expiration',
        'Coding will expire in 21'
      );
    });
  });

  describe('onCreate of a Milestone Notification', () => {
    it('it will check the returned values on milestone creation', () => {
      expect(onCreateMilestoneNotification('Write test often', 'Coding')).toHaveProperty(
        'Title',
        'Description',
        'Milestone Creation',
        'Write test often has been created under the Coding'
      );
    });
  });

  describe('onExpiration of a Milestone Notification', () => {
    it('it will check the returned values on milestone expiration', () => {
      expect(onMilestoneExpirationNotification('Write test often', 4)).toHaveProperty(
        'Title',
        'Description',
        'Milestone Expiration',
        'Write test often will expire in 4'
      );
    });
  });
});
