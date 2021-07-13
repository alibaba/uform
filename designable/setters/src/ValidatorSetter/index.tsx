import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import React, { Fragment, useMemo, useState } from 'react'
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
    const { onChange, value } = props

    const validatorInfo = useMemo(
      () => ({
        validators: value || [],
        selectedKey: '',
      }),
      [value]
    )

    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)

    return (
      <Fragment>
        <ValidatorList
          onChange={onChange}
          validatorInfo={validatorInfo}
          onEditRuleClick={openModal}
        ></ValidatorList>

        <ValidatorModal
          validatorInfo={validatorInfo}
          onChange={onChange}
          visible={modalVisible}
          closeModal={closeModal}
        ></ValidatorModal>
      </Fragment>
    )
  }
)
