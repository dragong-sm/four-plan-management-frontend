import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import Service from '../service/Service';

export const ApiContext = createContext();

export const color = {
  ANNAUL_COLOR: '#D3D3D3', //휴가
  DUTY_COLOR: '#FF9AA2', // 당직
  DEV_DEPT_COLOR: '#B5EAD7', //개발x팀
  HR_DEPT_COLOR: '#C7CEEA', //인사
  DESIGN_DEPT_COLOR: '#FFB7B2', //디자인
};

export function ApiProvider({ children }) {
  const [user, setUser] = useState({});
  const [selectedUser, setSelectedUser] = useState([]); // 클릭해서 담은 값

  const service = new Service();

  // const [value, setValue] = useState({
  //   id: user.id,
  //   start_date: startDay,
  //   end_date: endDay,
  //   scheduleType: 'YEARLY',
  // });

  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    axios.get('/user/userLogin.json').then(res => setUser(res.data.user));
    axios.get('/user/schedule.json').then(res => setSchedule(res.data.users));
  }, []);
  // useEffect(() => {
  //   axios.get('/user/userLogin.json').then(res => setUser(res));
  // }, []);

  useEffect(() => {
    if (user.length > 0) {
      const newUser = schedule.filter(
        user => user.Schedule.account_id === user.accountId
      );
      setUser(newUser);
    }
  }, [user]);

  // console.log(user);

  return (
    <ApiContext.Provider
      value={{ service, user, selectedUser, setSelectedUser, color }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useService() {
  return useContext(ApiContext);
}
