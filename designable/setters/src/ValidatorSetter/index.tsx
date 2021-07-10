import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { Button, Form, Modal, Select, Space } from 'antd'
import React, { Fragment, useState } from 'react'
import './styles.less'
import { IValidatorItem } from './types'

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

export interface IValidatorSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  value: IValidatorItem[]
}
export const ValidatorSetter: React.FC<IValidatorSetterProps> = observer(
  (props) => {
    const [form] = Form.useForm()

    const [isModalVisible, setIsModalVisible] = useState(false)

    return (
      <Fragment>
        <Form form={form} name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="validators">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'first']}
                      fieldKey={[fieldKey, 'first']}
                    >
                      {/* {console.log(form.getFieldValue('validators'))} */}
                      {form.getFieldValue('validators')[name].type ===
                      'buildin' ? (
                        <Select>
                          <Select.Option value="demo">phone</Select.Option>
                          <Select.Option value="demo2">email</Select.Option>
                        </Select>
                      ) : (
                        <Button
                          onClick={() => {
                            setIsModalVisible(true)
                          }}
                        >
                          编辑
                        </Button>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      fieldKey={[fieldKey, 'type']}
                    >
                      <Button
                        onClick={() => {
                          let type = 'buildin'
                          if (
                            form.getFieldValue('validators')[name].type ===
                            'buildin'
                          ) {
                            type = 'obj'
                          }
                          const validators = form.getFieldValue('validators')

                          validators[name].type = type
                          // console.log(type)
                          form.setFields([
                            {
                              name: 'validators',
                              value: validators,
                            },
                          ])
                        }}
                      >
                        {form.getFieldValue('validators')[name].type ===
                        'buildin'
                          ? '内置'
                          : '对象'}
                      </Button>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        first: '',
                        type: 'buildin',
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    添加
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>

        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
          }}
        >
          {fields.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </Modal>
        {/* <Button block>
          <TextWidget token="SettingComponents.ValidatorSetter.addValidator" />
          添加
        </Button> */}
      </Fragment>
    )
  }
)
