import { TextWidget } from '@designable/react'
import { observer } from '@formily/reactive-react'
import { Button } from 'antd'
import React, { Fragment } from 'react'
import './styles.less'
import { IValidatorItem } from './types'

export interface IValidatorSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  value: IValidatorItem[]
}
export const ValidatorSetter: React.FC<IValidatorSetterProps> = observer(
  (props) => {
    return (
      <Fragment>
        <Button block>
          <TextWidget token="SettingComponents.ValidatorSetter.addValidator" />
        </Button>
      </Fragment>
    )
  }
)
