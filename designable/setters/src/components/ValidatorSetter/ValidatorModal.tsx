import { TextWidget, usePrefix, useTheme } from '@designable/react'
import {
  ArrayItems,
  Form,
  FormItem,
  Input,
  Select,
  Switch,
} from '@formily/antd'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { observer } from '@formily/reactive-react'
import { Modal } from 'antd'
import React, { Fragment, useMemo } from 'react'
import { buildIn } from './shared'
import './styles.less'
import { IValidatorInfo } from './types'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Switch,
    ArrayItems,
  },
})

const numberFields = [
  'len',
  'max',
  'min',
  'maximum',
  'minimum',
  'exclusiveMaximum',
  'exclusiveMinimum',
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
    const prefix = usePrefix('validator-setter')

    const form = useMemo(() => {
      return createForm({
        values: validatorInfo.validators[validatorInfo.selectedKey] || {},
      })
    }, [validatorInfo.selectedKey])

    return (
      <Fragment>
        <Modal
          className={`${prefix}-modal`}
          width={'65%'}
          title={<TextWidget token="SettingComponents.ValidatorSetter.edit" />}
          bodyStyle={{ padding: 10 }}
          transitionName=""
          maskTransitionName=""
          visible={visible}
          onCancel={closeModal}
          onOk={() => {
            const t = validatorInfo.validators.map((validator, id) => {
              if ('' + id !== validatorInfo.selectedKey) {
                return validator
              }
              return form.values
            })

            onChange(t)
            closeModal()
          }}
        >
          <Form form={form} labelWidth={150} wrapperWidth={300}>
            <SchemaField>
              <SchemaField.String
                name="triggerType"
                title="triggerType"
                x-decorator="FormItem"
                x-component="Select"
                enum={[
                  { label: 'onInput', value: 'onInput' },
                  { label: 'onFocus', value: 'onFocus' },
                  { label: 'onBlur', value: 'onBlur' },
                ]}
              />
              <SchemaField.String
                name="required"
                title="required"
                x-decorator="FormItem"
                x-component="Switch"
              />
              <SchemaField.String
                name="format"
                title="format"
                x-decorator="FormItem"
                x-component="Select"
                enum={buildIn.map((d) => ({ label: d, value: d }))}
              />
              <SchemaField.String
                name="validator"
                title="validator"
                x-decorator="FormItem"
                x-component="Input"
              />
              <SchemaField.String
                name="pattern"
                title="pattern"
                x-decorator="FormItem"
                x-component="Input"
              />
              {numberFields.map((d, i) => (
                <SchemaField.Number
                  key={i}
                  name={d}
                  title={d}
                  x-decorator="FormItem"
                  x-component="Input"
                />
              ))}
              <SchemaField.String
                name="whitespace"
                title="whitespace"
                x-decorator="FormItem"
                x-component="Switch"
              />
              <SchemaField.Array
                name="enum"
                title="enum"
                x-decorator="FormItem"
                x-component="ArrayItems"
              >
                <SchemaField.Void x-component="Space">
                  <SchemaField.Void
                    x-decorator="FormItem"
                    x-component="ArrayItems.SortHandle"
                  />
                  <SchemaField.String
                    x-decorator="FormItem"
                    required
                    name="input"
                    x-component="Input"
                  />
                  <SchemaField.Void
                    x-decorator="FormItem"
                    x-component="ArrayItems.Remove"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayItems.Addition"
                  title="添加条目"
                />
              </SchemaField.Array>

              <SchemaField.String
                name="message"
                title="message"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaField>
          </Form>
        </Modal>
      </Fragment>
    )
  }
)
