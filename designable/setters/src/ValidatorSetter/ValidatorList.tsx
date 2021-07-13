import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { TextWidget, usePrefix } from '@designable/react'
import { observer } from '@formily/reactive-react'
import { Button } from 'antd'
import React, { Fragment } from 'react'
import './styles.less'
import { IValidatorInfo } from './types'
import { ValidatorInput } from './ValidatorInput'
export interface IValidatorListProps {
  onChange(): void
  onEditRuleClick(): void
  validatorInfo: IValidatorInfo
}

export const ValidatorList: React.FC<IValidatorListProps> = observer(
  (props) => {
    const { onEditRuleClick, validatorInfo, onChange } = props
    const prefix = usePrefix('validator-setter')

    return (
      <Fragment>
        <div className={`${prefix + '-content'}`}>
          {validatorInfo.validators.map((validator, id) => {
            return (
              <div className={`${prefix + '-content--item'}`} key={null}>
                <ValidatorInput
                  onChange={(newValidator) => {
                    let t = validatorInfo.validators.map((validator, tid) => {
                      if (tid !== id) {
                        return validator
                      }
                      return newValidator
                    })
                    onChange(t)
                  }}
                  value={validator}
                  onEditRuleClick={() => {
                    validatorInfo.selectedKey = id
                    onEditRuleClick()
                  }}
                ></ValidatorInput>
                <DeleteOutlined
                  onClick={() => {
                    let t = validatorInfo.validators.filter(
                      (validator, tid) => {
                        if (tid === id) {
                          return false
                        }
                        return true
                      }
                    )
                    onChange(t)
                  }}
                />
              </div>
            )
          })}

          <Button
            block
            onClick={() => {
              onChange([...validatorInfo.validators, 'number'])
            }}
            icon={<PlusOutlined />}
          >
            <TextWidget token="SettingComponents.ValidatorSetter.add" />
          </Button>
        </div>
      </Fragment>
    )
  }
)