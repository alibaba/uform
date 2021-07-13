import React, { useEffect, useMemo, useState } from 'react'
import { clone } from '@formily/shared'
import { createForm, isVoidField } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { GlobalRegistry } from '@designable/core'
import { requestIdle } from '@designable/shared'
import { usePrefix, TextWidget } from '@designable/react'
import { MonacoInput } from '@designable/react-settings-form'
import { Form, ArrayTable, Input, FormItem, FormCollapse } from '@formily/antd'
import { Modal, Card, Button } from 'antd'
import { PathSelector } from './PathSelector'
import { FieldPropertySetter } from './FieldPropertySetter'
import { IReaction } from './types'
import './styles.less'

export interface IReactionsSetterProps {
  value?: IReaction
  onChange?: (value: IReaction) => void
}

const SchemaField = createSchemaField({
  components: {
    Card,
    FormCollapse,
    Input,
    FormItem,
    PathSelector,
    FieldPropertySetter,
    ArrayTable,
    MonacoInput,
  },
})

export const ReactionsSetter: React.FC<IReactionsSetterProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [innerVisible, setInnerVisible] = useState(false)
  const prefix = usePrefix('reactions-setter')
  const form = useMemo(() => {
    return createForm({
      values: clone(props.value),
    })
  }, [modalVisible, props.value])
  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)
  useEffect(() => {
    if (modalVisible) {
      requestIdle(
        () => {
          setInnerVisible(true)
        },
        {
          timeout: 400,
        }
      )
    } else {
      setInnerVisible(false)
    }
  }, [modalVisible])
  return (
    <>
      <Button block onClick={openModal}>
        <TextWidget token="SettingComponents.ReactionsSetter.configureReactions" />
      </Button>
      <Modal
        title={GlobalRegistry.getDesignerMessage(
          'SettingComponents.ReactionsSetter.configureReactions'
        )}
        width="65%"
        centered
        bodyStyle={{ padding: 10 }}
        transitionName=""
        maskTransitionName=""
        visible={modalVisible}
        onCancel={closeModal}
        destroyOnClose
        onOk={() => {
          form.submit((values) => {
            props.onChange?.(values)
          })
          closeModal()
        }}
      >
        <div className={prefix}>
          {innerVisible && (
            <Form form={form}>
              <SchemaField>
                <SchemaField.Void
                  x-component="Card"
                  x-component-props={{
                    title: GlobalRegistry.getDesignerMessage(
                      'SettingComponents.ReactionsSetter.relationsFields'
                    ),
                    size: 'small',
                    type: 'inner',
                    style: { marginBottom: 10 },
                  }}
                >
                  <SchemaField.Array
                    name="dependencies"
                    default={[{}]}
                    x-component="ArrayTable"
                    x-component-props={{ bordered: false }}
                  >
                    <SchemaField.Object>
                      <SchemaField.Void
                        x-component="ArrayTable.Column"
                        x-component-props={{
                          title: GlobalRegistry.getDesignerMessage(
                            'SettingComponents.ReactionsSetter.variableName'
                          ),
                          width: 240,
                        }}
                      >
                        <SchemaField.String
                          name="name"
                          x-decorator="FormItem"
                          x-validator={{
                            pattern: /^[$_a-zA-Z]+[$_a-zA-Z0-9]*$/,
                            message: GlobalRegistry.getDesignerMessage(
                              'SettingComponents.ReactionsSetter.variableNameValidateMessage'
                            ),
                          }}
                          x-component="Input"
                          x-component-props={{
                            addonBefore: '$deps.',
                            placeholder: GlobalRegistry.getDesignerMessage(
                              'SettingComponents.ReactionsSetter.pleaseInput'
                            ),
                          }}
                        />
                      </SchemaField.Void>
                      <SchemaField.Void
                        x-component="ArrayTable.Column"
                        x-component-props={{
                          title: GlobalRegistry.getDesignerMessage(
                            'SettingComponents.ReactionsSetter.sourceField'
                          ),
                          width: 240,
                        }}
                      >
                        <SchemaField.String
                          name="source"
                          x-decorator="FormItem"
                          x-component="PathSelector"
                          x-component-props={{
                            placeholder: GlobalRegistry.getDesignerMessage(
                              'SettingComponents.ReactionsSetter.pleaseSelect'
                            ),
                          }}
                        />
                      </SchemaField.Void>
                      <SchemaField.Void
                        x-component="ArrayTable.Column"
                        x-component-props={{
                          title: GlobalRegistry.getDesignerMessage(
                            'SettingComponents.ReactionsSetter.fieldValueType'
                          ),
                          width: 160,
                          align: 'center',
                        }}
                      >
                        <SchemaField.String
                          name="type"
                          default="any"
                          x-decorator="FormItem"
                          x-component="Input"
                          x-pattern="readPretty"
                          x-reactions={(field) => {
                            if (isVoidField(field)) return
                            field.query('.source').take((source) => {
                              if (isVoidField(source)) return
                              if (source.value) {
                                field.value =
                                  source.inputValues[1]?.props?.type || 'any'
                              }
                            })
                          }}
                        />
                      </SchemaField.Void>
                      <SchemaField.Void
                        x-component="ArrayTable.Column"
                        x-component-props={{
                          title: GlobalRegistry.getDesignerMessage(
                            'SettingComponents.ReactionsSetter.operations'
                          ),
                          align: 'center',
                          width: 120,
                        }}
                      >
                        <SchemaField.Markup
                          type="void"
                          x-component="ArrayTable.Remove"
                        />
                      </SchemaField.Void>
                    </SchemaField.Object>
                    <SchemaField.Void
                      title={GlobalRegistry.getDesignerMessage(
                        'SettingComponents.ReactionsSetter.addRelationField'
                      )}
                      x-component="ArrayTable.Addition"
                    />
                  </SchemaField.Array>
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="Card"
                  x-component-props={{
                    title: GlobalRegistry.getDesignerMessage(
                      'SettingComponents.ReactionsSetter.propertyReactions'
                    ),
                    size: 'small',
                    type: 'inner',
                    style: { marginBottom: 10 },
                  }}
                >
                  <SchemaField.Markup
                    name="fulfill.state"
                    x-component="FieldPropertySetter"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="FormCollapse"
                  x-component-props={{
                    style: { marginBottom: 10 },
                  }}
                >
                  <SchemaField.Void
                    x-component="FormCollapse.CollapsePanel"
                    x-component-props={{
                      key: 'run',
                      header: GlobalRegistry.getDesignerMessage(
                        'SettingComponents.ReactionsSetter.actionReactions'
                      ),
                    }}
                  >
                    <SchemaField.String
                      name="fulfill.run"
                      x-component="MonacoInput"
                      x-component-props={{
                        width: '100%',
                        height: 200,
                        language: 'typescript',
                      }}
                    />
                  </SchemaField.Void>
                </SchemaField.Void>
              </SchemaField>
            </Form>
          )}
        </div>
      </Modal>
    </>
  )
}
