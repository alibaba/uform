import React, { Fragment, useMemo, useState } from 'react'
import cls from 'classnames'
import { Modal, Button } from 'antd'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { usePrefix, useTheme, TextWidget } from '@designable/react'
import './styles.less'

const fields = [
  'triggerType',
  'format',
  'validator',
  'required',
  'pattern',
  'max',
  'maximum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'minimum',
  'min',
  'len',
  'whitespace',
  'enum',
  'message',
]

export interface IValidatorModalProps {
  visible?: boolean
  closeModal?(): void
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  value: IDataSourceItem[]
}
export const ValidatorModal: React.FC<IValidatorModalProps> = observer(
  (props) => {
    const { className, value = [], onChange, visible, closeModal } = props
    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')

    return (
      <Fragment>
        <Modal
          width={'65%'}
          title={<TextWidget token="SettingComponents.ValidatorSetter.edit" />}
          bodyStyle={{ padding: 10 }}
          transitionName=""
          maskTransitionName=""
          visible={visible}
          onCancel={closeModal}
          onOk={() => {
            closeModal()
          }}
        >
          {fields.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </Modal>
      </Fragment>
    )
  }
)
