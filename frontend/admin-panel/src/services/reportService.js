import api from './api';

const calendarService = {
  getEvents: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const path = (user?.role === 'employee') ? '/report/my' : '/report';

    return api.get(path)
      .then(res =>
        res.data.map(r => ({
          id:    r._id,
          title: `${r.user?.name || r.employeeName}: ${r.workDetails.slice(0, 20)}…`,
          date:  r.date,
        }))
      );
  },
};

export default calendarService;
