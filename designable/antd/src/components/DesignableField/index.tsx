import React from 'react'
import { FormPath } from '@formily/core'
import { GlobalRegistry, TreeNode } from '@designable/core'
import { useDesigner, useTreeNode } from '@designable/react'
import {
  ArrayField,
  Field,
  ObjectField,
  VoidField,
  observer,
  Schema,
  ISchema,
} from '@formily/react'
import { FormTab } from '@formily/antd'
import { clone } from '@formily/shared'
import { FormItemSwitcher } from '../FormItemSwitcher'
import { DesignableObject } from '../DesignableObject'
import { createOptions } from './options'
import { IDesignableFieldProps } from './types'
import { includesComponent } from '../../shared'
import * as defaultSchemas from '../../schemas'

Schema.silent()

export const createDesignableField = (options: IDesignableFieldProps) => {
  const realOptions = createOptions(options)

  const tabs = {}

  const getFieldPropsSchema = (node: TreeNode): ISchema => {
    const decorator = node.props['x-decorator']
    const component = node.props['x-component']
    const decoratorSchema =
      decorator &&
      (FormPath.getIn(realOptions.componentsPropsSchema, decorator) ||
        FormPath.getIn(defaultSchemas, decorator))
    const componentSchema =
      component &&
      (FormPath.getIn(realOptions.componentsPropsSchema, component) ||
        FormPath.getIn(defaultSchemas, component))
    const TabSchema = (key: string, schema: ISchema) => {
      tabs[key] = tabs[key] || FormTab.createFormTab()
      return {
        type: 'object',
        properties: {
          propsTab: {
            type: 'void',
            'x-component': 'FormTab',
            'x-component-props': {
              formTab: tabs[key],
              style: {
                overflow: 'visible',
              },
            },
            properties: {
              propsPane: {
                type: 'void',
                'x-component': 'FormTab.TabPane',
                'x-component-props': {
                  tab: GlobalRegistry.getDesignerMessage(
                    `settings.${key}.tab_property`
                  ),
                },
                properties: schema.properties,
              },
              stylePane: {
                type: 'void',
                'x-component': 'FormTab.TabPane',
                'x-component-props': {
                  tab: GlobalRegistry.getDesignerMessage(
                    `settings.${key}.tab_style`
                  ),
                },
                properties: {
                  style: defaultSchemas.CSSStyle,
                },
              },
            },
          },
        },
      }
    }
    const base = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-index': 0,
        },
        title: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-index': 1,
        },
        description: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-index': 2,
        },
        'x-display': {
          type: 'string',
          enum: ['visible', 'hidden', 'none', ''],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'visible',
          },
          'x-index': 3,
        },
        'x-pattern': {
          type: 'string',
          enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'editable',
          },
          'x-index': 4,
        },
        'x-component-props':
          componentSchema && TabSchema('x-component-props', componentSchema),
        'x-decorator-props':
          decoratorSchema && TabSchema('x-decorator-props', decoratorSchema),
      },
    }

    if (node.props.type === 'void') {
      if (!includesComponent(node, realOptions.dropReactionComponents)) {
        Object.assign(base.properties, {
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-index': 5,
            // 'x-component': 'ReactionsSetter',
          },
        })
      }
      if (!includesComponent(node, realOptions.dropFormItemComponents)) {
        Object.assign(base.properties, {
          'x-decorator': {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': FormItemSwitcher,
            'x-index': 10,
            'x-reactions': {
              target: '*(title,description)',
              fulfill: {
                state: {
                  hidden: '{{$self.value !== "FormItem"}}',
                },
              },
            },
          },
        })
      } else {
        delete base.properties.title
        delete base.properties.description
      }
    } else {
      if (!includesComponent(node, realOptions.dropReactionComponents)) {
        Object.assign(base.properties, {
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-index': 8,
            // 'x-component': 'ReactionsSetter',
          },
        })
      }
      Object.assign(base.properties, {
        default: {
          'x-decorator': 'FormItem',
          'x-component': 'ValueInput',
          'x-index': 5,
        },
        enum: {
          'x-decorator': 'FormItem',
          'x-component': 'DataSourceSetter',
          'x-index': 6,
        },
        'x-validator': {
          'x-decorator': 'FormItem',
          'x-component': 'ValidatorSetter',
          'x-index': 7,
        },
        required: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-index': 9,
        },
      })
    }

    return base
  }

  const calculateRestricts = (target: TreeNode, source: TreeNode[]) => {
    const targetComponent = target.props['x-component']
    const restrictChildrenComponents =
      realOptions.restrictChildrenComponents?.[targetComponent]
    if (restrictChildrenComponents?.length) {
      if (
        source.every((node) =>
          includesComponent(node, restrictChildrenComponents, target)
        )
      ) {
        return true
      }
      return false
    }
    return true
  }

  if (!realOptions.registryName) throw new Error('Can not found registryName')

  GlobalRegistry.registerDesignerProps({
    [realOptions.registryName]: (node) => {
      const componentName = node.props?.['x-component']
      const message = GlobalRegistry.getDesignerMessage(
        `components.${componentName}`
      )
      const isObjectNode = node.props.type === 'object'
      const isArrayNode = node.props.type === 'array'
      const isVoidNode = node.props.type === 'void'
      const title = typeof message === 'string' ? message : message?.title
      const nodeTitle =
        title ||
        (isObjectNode
          ? GlobalRegistry.getDesignerMessage('components.Object')
          : isVoidNode
          ? GlobalRegistry.getDesignerMessage('components.Void')
          : '')
      return {
        title: nodeTitle,
        draggable: true,
        droppable: isObjectNode || isArrayNode || isVoidNode,
        selfRenderChildren:
          isArrayNode ||
          includesComponent(node, realOptions.selfRenderChildrenComponents),
        inlineLayout: includesComponent(
          node,
          realOptions.inlineLayoutComponents
        ),
        inlineChildrenLayout: includesComponent(
          node,
          realOptions.inlineChildrenLayoutComponents
        ),
        allowAppend(target, source) {
          return (
            (target.props.type === 'void' ||
              target.props.type === 'array' ||
              target.props.type === 'object') &&
            calculateRestricts(target, source)
          )
        },
        propsSchema: getFieldPropsSchema(node),
      }
    },
  })

  const DesignableField: React.FC<ISchema> = observer((props) => {
    const designer = useDesigner()
    const node = useTreeNode()
    if (!node) return null

    const getFieldProps = () => {
      const base = new Schema(clone(props)).compile()
      const fieldProps = base.toFieldProps({
        components: realOptions.components,
      })
      if (fieldProps.decorator?.[0]) {
        fieldProps.decorator[1] = fieldProps.decorator[1] || {}
        FormPath.setIn(
          fieldProps.decorator[1],
          designer.props.nodeIdAttrName,
          node.id
        )
      } else if (fieldProps.component?.[0]) {
        fieldProps.component[1] = fieldProps.component[1] || {}
        FormPath.setIn(
          fieldProps.component[1],
          designer.props.nodeIdAttrName,
          node.id
        )
      }
      fieldProps.value = fieldProps.initialValue
      return fieldProps as any
    }

    const fieldProps = getFieldProps()
    if (props.type === 'object') {
      return (
        <DesignableObject>
          <ObjectField {...fieldProps} name={node.id}>
            {props.children}
          </ObjectField>
        </DesignableObject>
      )
    } else if (props.type === 'array') {
      return <ArrayField {...fieldProps} name={node.id} />
    } else if (node.props.type === 'void') {
      return (
        <VoidField {...fieldProps} name={node.id}>
          {props.children}
        </VoidField>
      )
    }
    return <Field {...fieldProps} name={node.id} />
  })

  return DesignableField
}
