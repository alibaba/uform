import React, { useMemo, Fragment, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ArrayItems,
  Form,
  Input,
  FormItem,
  LifeCycleTypes,
} from '@formily/antd'
import { createForm } from '@formily/core'
import { observer } from '@formily/reactive-react'
import { createSchemaField } from '@formily/react'
import { ValidatorInput } from './ValidatorInput'
import { usePrefix, TextWidget } from '@designable/react'
import { Header } from './Header'
import { traverseTree } from './shared'
import { ITreeDataSource } from './types'
import './styles.less'

export interface IValidatorListProps {
  onChange
  treeDataSource: ITreeDataSource
  onEditRuleClick(): void
  validators: any
}

export const ValidatorList: React.FC<IValidatorListProps> = observer(
  (props) => {
    const { onEditRuleClick, validators, onChange } = props
    const prefix = usePrefix('validator-setter')
    // const [validators, setValidators] = useState([])

    return (
      <Fragment>
        <div className={`${prefix + '-content'}`}>
          {validators.validators.map((validator, i) => {
            return (
              <ValidatorInput
                key={i}
                onChange={(d) => {
                  validators.validators = validators.validators.map(
                    (validator, ti) => {
                      if (ti !== i) {
                        return validator
                      }
                      return d
                    }
                  )
                  onChange(validators.validators)
                }}
                value={validator}
                onEditRuleClick={() => {
                  validators.selectedKey = i
                  onEditRuleClick()
                }}
              ></ValidatorInput>
            )
          })}

          <Button
            block
            onClick={() => {
              validators.validators = [...validators.validators, '']
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
