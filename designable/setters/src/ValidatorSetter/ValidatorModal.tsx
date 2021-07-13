import { TextWidget, usePrefix, useTheme } from '@designable/react'
import { Form, FormItem, Input, Select } from '@formily/antd'
import { createForm, onFieldValueChange } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { observer } from '@formily/reactive-react'
import { Modal } from 'antd'
import React, { Fragment, useMemo } from 'react'
import './styles.less'
import { IValidatorInfo } from './types'

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

// const actions = createFormActions()

export interface IValidatorModalProps {
  visible?: boolean
  closeModal?(): void
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  validatorInfo: IValidatorInfo
}
export const ValidatorModal: React.FC<IValidatorModalProps> = observer(
  (props) => {
    const { className, onChange, visible, closeModal, validatorInfo } = props

    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')

    const form = useMemo(() => {
      return createForm({
        values: validatorInfo.validators[validatorInfo.selectedKey] || {},
      })
    }, [validatorInfo.selectedKey])

    const SchemaField = createSchemaField({
      components: {
        FormItem,
        Input,
        Select,
      },
    })

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
            const t = validatorInfo.validators.map((validator, id) => {
              if (id !== validatorInfo.selectedKey) {
                return validator
              }
              return form.values
            })

            onChange(t)
            closeModal()
          }}
        >
          <Form form={form}>
            <SchemaField>
              {fields.map((d, i) => (
                <SchemaField.String
                  key={i}
                  name={d}
                  title={d}
                  x-component="Input"
                  x-decorator="FormItem"
                />
              ))}
            </SchemaField>
          </Form>
        </Modal>
      </Fragment>
    )
  }
)
