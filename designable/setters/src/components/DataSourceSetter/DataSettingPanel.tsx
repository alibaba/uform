import React, { useMemo, Fragment } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ArrayItems, Form, Input, FormItem } from '@formily/antd'
import { createForm } from '@formily/core'
import { observer } from '@formily/reactive-react'
import { createSchemaField } from '@formily/react'
import { ValueInput } from '@designable/react-settings-form'
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
    ValueInput,
  },
})

export interface IDataSettingPanelProps {
  treeDataSource: ITreeDataSource
}

export const DataSettingPanel: React.FC<IDataSettingPanelProps> = observer(
  (props) => {
    const prefix = usePrefix('data-source-setter')
    const form = useMemo(() => {
      let values: any
      traverseTree(props.treeDataSource.dataSource, (dataItem) => {
        if (dataItem.key === props.treeDataSource.selectedKey) {
          values = dataItem
        }
      })
      return createForm({
        values,
      })
    }, [
      props.treeDataSource.selectedKey,
      props.treeDataSource.dataSource.length,
    ])
    if (!props.treeDataSource.selectedKey)
      return (
        <Fragment>
          <Header
            title={
              <TextWidget token="SettingComponents.DataSourceSetter.nodeProperty" />
            }
            extra={null}
          />
          <div className={`${prefix + '-layout-item-content'}`}>
            <TextWidget token="SettingComponents.DataSourceSetter.pleaseSelectNode" />
          </div>
        </Fragment>
      )
    return (
      <Fragment>
        <Header
          title={
            <TextWidget token="SettingComponents.DataSourceSetter.nodeProperty" />
          }
          extra={
            <Button
              type="text"
              onClick={() => {
                form.setFieldState('map', (state) => {
                  state.value.push({})
                })
              }}
              icon={<PlusOutlined />}
            >
              <TextWidget token="SettingComponents.DataSourceSetter.addKeyValuePair" />
            </Button>
          }
        />
        <div className={`${prefix + '-layout-item-content'}`}>
          <Form form={form} labelWidth={60} wrapperWidth={160}>
            <SchemaField>
              <SchemaField.Array name="map" x-component="ArrayItems">
                <SchemaField.Object
                  x-decorator="ArrayItems.Item"
                  x-decorator-props={{ type: 'divide' }}
                >
                  <SchemaField.String
                    title={
                      <TextWidget token="SettingComponents.DataSourceSetter.label" />
                    }
                    x-decorator="FormItem"
                    name="label"
                    x-component="Input"
                  />
                  <SchemaField.String
                    title={
                      <TextWidget token="SettingComponents.DataSourceSetter.value" />
                    }
                    x-decorator="FormItem"
                    name="value"
                    x-component="ValueInput"
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
        </div>
      </Fragment>
    )
  }
)
