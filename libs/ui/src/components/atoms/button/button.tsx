import React from 'react';
import { ButtonBase } from './buttonStyles';
import classNames from 'classnames';

type ButtonProps = {
  children: React.ReactNode;
  secondary: boolean;
  sm: boolean;
  lg: boolean;
  tertiary: boolean;
  disabled: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({
  secondary,
  sm,
  lg,
  children,
  tertiary,
  disabled,
  onClick,
}: ButtonProps) => {
  const classes = classNames({ secondary, sm, lg, tertiary });
  return (
    <ButtonBase className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </ButtonBase>
  );
};
export default Button;