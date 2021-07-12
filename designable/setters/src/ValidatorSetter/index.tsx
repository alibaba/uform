import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { Button, Form, Modal, Select, Space } from 'antd'
import React, { Fragment, useState } from 'react'
import './styles.less'
import { IValidatorItem } from './types'
import { ValidatorList } from './ValidatorList'
import { ValidatorModal } from './ValidatorModal'

export interface IValidatorSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  value: IValidatorItem[]
}
export const ValidatorSetter: React.FC<IValidatorSetterProps> = observer(
  (props) => {
    const [form] = Form.useForm()

    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)

    return (
      <Fragment>
        <ValidatorList onEditRuleClick={openModal}></ValidatorList>

        <ValidatorModal
          visible={modalVisible}
          closeModal={closeModal}
        ></ValidatorModal>
      </Fragment>
    )
  }
)
