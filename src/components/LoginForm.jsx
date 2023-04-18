import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { setCookie } from '../cookie';
import { useService } from '../context/context';

export default function LoginForm() {
  const { service } = useService();
  // url 이동
  const navigate = useNavigate();
  // pw 보이기
  const [isVisiblePw, setIsVisiblePw] = useState(false);

  // 입력값 : react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm();

  // onValid : 검사
  const onValid = data => {
    onSubmit(data);
  };

  // Enter 눌렀을 경우에도 로그인 요청
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(onValid);
    }
  };

  // onSubmit : 등록
  const onSubmit = data => {
    service
      .login({
        accountId: data.accountId,
        password: data.password,
      })
      .then(res => {
        // console.log(res);
        if (res.status === 200) {
          const accessToken = res.data.accessToken;
          // 세선쿠키
          setCookie('accessToken', accessToken, {
            path: '/',
          });
          if (window.location.href === 'http://localhost:3000/') {
            res.data.user.role === 'ROLE_USER' ? (
              navigate('/main', { state: res.data.user })
            ) : (
              <>
                {setError('password', {
                  message:
                    '관리자의 경우, 관리자 로그인 페이지를 이용해주시길 바랍니다.',
                })}
              </>
            );
          }
          if (window.location.href === 'http://localhost:3000/admin') {
            res.data.user.role === 'ROLE_ADMIN' ? (
              navigate('/admin/main', { state: res.data.user })
            ) : (
              <>
                {setError('password', {
                  message: '관리자 아이디로 로그인 바랍니다.',
                })}
              </>
            );
          }
        }
      })
      .catch(e => {
        setValue('password', '');
        setError('password', {
          message: '아이디 또는 비밀번호가 일치하지 않습니다.',
        });
      });
  };

  return (
    <Form onSubmit={handleSubmit(onValid)} onKeyPress={onKeyPress}>
      {/* id */}
      <LoginInput
        type="text"
        id="accountId"
        placeholder="Please enter your ID"
        {...register('accountId', {
          required: '아이디를 입력해주세요.',
          pattern: {
            value: /^[a-zA-Z0-9]+$/,
            message: '아이디 입력이 잘못되었습니다.',
          },
        })}
      />
      {errors.accountId && (
        <WarningPhrase>{errors.accountId.message}</WarningPhrase>
      )}
      {/* pw */}
      <Div>
        <LoginInput
          type={isVisiblePw ? 'text' : 'password'}
          id="password"
          placeholder="Please enter your Password"
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
          })}
        />
        <Icon onClick={() => setIsVisiblePw(!isVisiblePw)}>
          {isVisiblePw ? <AiFillEye /> : <AiFillEyeInvisible />}
        </Icon>
      </Div>
      {errors.password && (
        <WarningPhrase>{errors.password.message}</WarningPhrase>
      )}
      {/* signin btn */}
      <SignInBtn disabled={isSubmitting}>Sign In</SignInBtn>
    </Form>
  );
}

const Form = styled.form`
  width: 100%;
  margin: 20px 0 0;
  ${props => props.theme.variables.flex('column', '', 'center')};
`;

const LoginInput = styled.input`
  width: 80%;
  height: 50px;
  padding: 10px;
  margin-bottom: 20px;
  color: ${props => props.theme.style.text};
  font-size: ${props => props.theme.style.textMedium};
  border: 0;
  border-radius: ${props => props.theme.style.BtnborderRadius};
  outline: none;
  &:focus {
    color: ${props => props.theme.style.text};
  }
`;

const Div = styled.div`
  width: 100%;
  margin: 0 auto;
  ${props => props.theme.variables.flex('column', '', 'center')};
  position: relative;
`;

const Icon = styled.div`
  color: ${props => props.theme.style.lightGray};
  position: absolute;
  cursor: pointer;
  top: 25%;
  right: 15%;
  transition: 0.4s ease;
  &:hover {
    color: ${props => props.theme.style.text};
  }
`;

const WarningPhrase = styled.p`
  color: ${props => props.theme.style.warning};
  margin-bottom: 20px;
  font-size: 12px;
`;

const SignInBtn = styled.button`
  width: 80%;
  height: 50px;
  padding: 5px;
  margin-bottom: 20px;
  font-size: ${props => props.theme.style.textMedium};
  color: ${props => props.theme.style.white};
  background-color: ${props => props.theme.style.blue};
  border: 0;
  border-radius: ${props => props.theme.style.BtnborderRadius};
  transition: 0.3s ease;
  &:hover {
    background-color: ${props => props.theme.style.text};
  }
`;
