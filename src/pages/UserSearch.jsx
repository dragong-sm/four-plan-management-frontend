import React, { useEffect, useRef, useState } from 'react';
import OutsideClick from './OutsideClick';
import styled from 'styled-components';

export default function UserSearch({ setIsModalOpen, schedule, setSelected }) {
  const [selectUser, setSelectUser] = useState(); // 모달에서 입력한 값
  const [searchList, setSearchList] = useState(); // selectUser를 통해서 정렬 값
  const [selectedUser, setSelectedUser] = useState([]); // 클릭해서 담은 값

  const ref = useRef();
  const inputRef = useRef();

  const onSubmit = e => {
    e.preventDefault();
    const value = inputRef.current.value;
    setSelectUser(value);
  };

  useEffect(() => {
    if (selectUser) {
      const list = schedule.filter(user => user.name.includes(selectUser));
      setSearchList(list);
    }
  }, [selectUser]);

  const handleChecked = e => {
    const index = e.target.name;
    const newArray = selectedUser.concat(searchList[index].Schedule.account_id);
    setSelectedUser(newArray);
    console.log(searchList[index]);
    // console.log(searchList[index]);
    // setSelected(searchList[index]);
    // setIsModalOpen(false);
  };

  OutsideClick(ref, () => {
    setSelected('전체'); // 아무것도 클릭 안했을때..
    setIsModalOpen(false);
  });

  const listener = e => {
    if (!ref.current || ref.current.contains(e.target)) {
      return;
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref]);

  function onClickButton() {
    setIsModalOpen(false);
    console.log(selectedUser);
    setSelected(selectedUser);
  }

  return (
    <>
      <Container />
      <SearchUser ref={ref} setIsModalOpen={setIsModalOpen}>
        <Form onSubmit={onSubmit}>
          <InputBox ref={inputRef} placeholder="User Name" />
          <UserList>
            {searchList &&
              searchList.map((user, i) => (
                <Li key={user.start + user.end + user.title}>
                  <Checkbox
                    type="checkbox"
                    id={user.Schedule.account_id}
                    name={i}
                    onChange={handleChecked}
                  />
                  <Label htmlFor={user.Schedule.account_id}>
                    <Name> 이름 : {user.name}</Name>
                    <Info>
                      <Department>부서 : {user.department}</Department>
                      <Position>직책 : {user.position}</Position>
                    </Info>
                  </Label>
                </Li>
              ))}
          </UserList>
        </Form>
        <Btn onClick={() => onClickButton()}>확인</Btn>
      </SearchUser>
    </>
  );
}

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 101vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 8;
  display: flex;
`;

const SearchUser = styled.div`
  position: absolute;
  top: 150px;
  left: 20%;
  width: 400px;
  height: 500px;
  background-color: ${props => props.theme.style.white};
  border: 10px solid ${props => props.theme.style.skyblue};
  border-radius: ${props => props.theme.style.borderRadius};

  z-index: 10;
  opacity: 1;
  font-size: 20px;
  // display: ${props => (props.toggle ? 'block' : 'none')};
  color: ${props => props.theme.style.text};
`;

const Form = styled.form`
  ${props => props.theme.variables.flex('column', 'center', 'center')}
  height: 100%;
`;

const InputBox = styled.input`
  width: 330px;
  height: 50px;
  border: 2px solid white;
  background-color: ${props => props.theme.style.mainBg};
  margin-bottom: 25px;
  outline: none;
  border-radius: 10px;
  text-indent: 12px;
  font-size: ${props => props.theme.style.textMedium};
  color: ${props => props.theme.style.text};

  &:focus {
    border-color: ${props => props.theme.style.text};
  }
`;

const UserList = styled.ul`
  padding: 15px;
  width: 330px;
  height: 280px;
  border: 2px solid ${props => props.theme.style.mainBg};
  background-color: ${props => props.theme.style.mainBg};
  border-radius: 10px;
`;

const Btn = styled.button``;

const Checkbox = styled.input`
  position: relative;
  top: -2px;
  margin-right: 10px;
  width: 12px;
  height: 12px;
  background-color: white;
  border: 1px solid ${props => props.theme.style.text};
  -webkit-appearance: auto;
`;

const Li = styled.li`
  ${props => props.theme.variables.flex('row', 'center', 'center')}
  margin-bottom :10px;
`;
const Label = styled.label`
  ${props => props.theme.variables.flex('column', 'center', 'center')}
  width : 280px;
  background-color: orange;
`;

const Name = styled.div`
  margin-bottom: 5px;
  padding: 5px;
`;
const Info = styled.div`
  ${props => props.theme.variables.flex('row', 'center', 'center')}
`;
const Department = styled.div``;
const Position = styled.div`
  margin-left: 12px;
`;