import Notifier from '../utilities';

const {
  notifyHabitCreation,
  notifyHabitExpiration,
  notifyMilestoneCreation,
  notifyMilestoneExpiration
} = Notifier;

describe('NOTIFICATION FUNCTION TEST SUITE', () => {
  describe('onCreate of a Habit Notification', () => {
    it('it will check the returned values on habit creation', () => {
      expect(notifyHabitCreation('Coding')).toHaveProperty(
        'Title',
        'Message',
        'Habit Creation',
        'Coding has been created'
      );
    });
  });

  describe('onExpiration of a Habit Notification', () => {
    it('it will check the returned values on habit expiration', () => {
      expect(notifyHabitExpiration('Coding', 21)).toHaveProperty(
        'Title',
        'Message',
        'Habit Expiration',
        'Coding will expire in 21'
      );
    });
  });

  describe('onCreate of a Milestone Notification', () => {
    it('it will check the returned values on milestone creation', () => {
      expect(notifyMilestoneCreation('Write test often', 'Coding')).toHaveProperty(
        'Title',
        'Message',
        'Milestone Creation',
        'Write test often has been created under the Coding'
      );
    });
  });

  describe('onExpiration of a Milestone Notification', () => {
    it('it will check the returned values on milestone expiration', () => {
      expect(notifyMilestoneExpiration('Write test often', 4)).toHaveProperty(
        'Title',
        'Message',
        'Milestone Expiration',
        'Write test often will expire in 4'
      );
    });
  });
});
