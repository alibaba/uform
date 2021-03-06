import React from 'react'
import { Button } from '@alifd/next'
import { ButtonProps } from '@alifd/next/lib/button'
import { useForm } from '@formily/react'

export interface IResetProps
  extends Formily.Core.Types.IFieldResetOptions,
    ButtonProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => any
  onResetValidateSuccess?: (payload: any) => void
  onResetValidateFailed?: (
    feedbacks: Formily.Core.Types.IFormFeedback[]
  ) => void
}

export const Reset: React.FC<IResetProps> = ({
  forceClear,
  validate,
  onResetValidateFailed,
  onResetValidateSuccess,
  ...props
}: IResetProps) => {
  const form = useForm()
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (props.onClick) {
          if (props.onClick(e) === false) return
        }
        form
          .reset('*', {
            forceClear,
            validate,
          })
          .then(onResetValidateSuccess)
          .catch(onResetValidateFailed)
      }}
    >
      {props.children}
    </Button>
  )
}

export default Reset
