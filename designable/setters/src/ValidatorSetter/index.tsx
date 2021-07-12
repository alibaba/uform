import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { Button, Form, Modal, Select, Space } from 'antd'
import React, { Fragment, useState } from 'react'
import './styles.less'
import { IValidatorItem } from './types'
import { ValidatorList } from './ValidatorList'

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
        <ValidatorList></ValidatorList>

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
