import React, { useMemo, Fragment } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ArrayItems, Form, Input, FormItem } from '@formily/antd'
import { createForm } from '@formily/core'
import { observer } from '@formily/reactive-react'
import { createSchemaField } from '@formily/react'
import { ValidatorInput } from './ValidatorInput'
import { usePrefix, TextWidget } from '@designable/react'
import { Header } from './Header'
import { traverseTree } from './shared'
import { ITreeDataSource } from './types'
import './styles.less'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayItems,
    ValidatorInput,
  },
})

export interface IValidatorListProps {
  treeDataSource: ITreeDataSource
  onEditRuleClick(): void
}

export const ValidatorList: React.FC<IValidatorListProps> = observer(
  (props) => {
    const { onEditRuleClick } = props
    const prefix = usePrefix('validator-setter')
    const form = useMemo(() => {
      let values: any
      return createForm({
        values,
      })
    }, [])
    return (
      <Fragment>
        <div className={`${prefix + '-content'}`}>
          <Form form={form}>
            <SchemaField>
              <SchemaField.Array name="map" x-component="ArrayItems">
                <SchemaField.Object
                  x-decorator="ArrayItems.Item"
                  x-decorator-props={{ type: 'divide' }}
                >
                  <SchemaField.String
                    x-decorator="FormItem"
                    name="value"
                    x-component="ValidatorInput"
                    x-component-props={{
                      onEditRuleClick,
                    }}
                  />
                  <SchemaField.Void
                    x-component="ArrayItems.Remove"
                    x-component-props={{
                      style: {
                        margin: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    }}
                  />
                </SchemaField.Object>
              </SchemaField.Array>
            </SchemaField>
          </Form>
          <Button
            block
            onClick={() => {
              form.setFieldState('map', (state) => {
                state.value.push({})
              })
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
