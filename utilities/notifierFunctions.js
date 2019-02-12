export default {
  notifyHabitCreation: habitName => {
    return {
      Title: 'Habit Creation',
      Message: `${habitName} has been created`
    };
  },

  notifyHabitExpiration(habitName, days) {
    return {
      Title: 'Habit Expiration',
      Message: `${habitName} will expire in ${days}`
    };
  },

  notifyMilestoneCreation(milestone, habitName) {
    return {
      Title: 'Milestone Creation',
      Message: `${milestone} has been created under the '${habitName}' habit`
    };
  },

  notifyMilestoneExpiration(milestone, days) {
    return {
      Title: 'Milestone Expiration',
      Message: `${milestone} will expire in ${days}`
    };
  }
};
