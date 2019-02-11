export const onCreateHabitNotification = habitName => {
  return {
    Title: 'Habit Creation',
    Description: `${habitName} has been created`
  };
};

export const onHabitExpirationNotification = (habitName, days) => {
  return {
    Title: 'Habit Expiration',
    Description: `${habitName} will expire in ${days}`
  };
};

export const onCreateMilestoneNotification = (milestone, habitName) => {
  return {
    Title: 'Milestone Creation',
    Description: `${milestone} has been created under the '${habitName}' habit`
  };
};

export const onMilestoneExpirationNotification = (milestone, days) => {
  return {
    Title: 'Milestone Expiration',
    Description: `${milestone} will expire in ${days}`
  };
};
