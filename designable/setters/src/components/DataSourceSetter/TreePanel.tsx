import React, { Fragment } from 'react'
import { Tree, Button, TreeProps } from 'antd'
import { uid } from '@formily/shared'
import { observer } from '@formily/reactive-react'
import { usePrefix, TextWidget, IconWidget } from '@designable/react'
import { Title } from './Title'
import { Header } from './Header'
import { traverseTree } from './shared'
import { ITreeDataSource, INodeItem } from './types'
import './styles.less'
import { GlobalRegistry } from '@designable/core'

export interface ITreePanelProps {
  treeDataSource: ITreeDataSource
}

export const TreePanel: React.FC<ITreePanelProps> = observer((props) => {
  const prefix = usePrefix('data-source-setter')
  const dropHandler = (info: Parameters<TreeProps['onDrop']>[0]) => {
    const dropKey = info.node?.key
    const dragKey = info.dragNode?.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    const data = [...props.treeDataSource.dataSource]
    // Find dragObject
    let dragObj: INodeItem
    traverseTree(data, (item, index, arr) => {
      if (arr[index].key === dragKey) {
        arr.splice(index, 1)
        dragObj = item
      }
    })
    if (!info.dropToGap) {
      traverseTree(data, (item) => {
        if (item.key === dropKey) {
          item.children = item.children || []
          item.children.unshift(dragObj)
        }
      })
    } else if (
      (info.node.children || []).length > 0 &&
      info.node.expanded &&
      dropPosition === 1
    ) {
      traverseTree(data, (item) => {
        if (item.key === dropKey) {
          item.children = item.children || []
          item.children.unshift(dragObj)
        }
      })
    } else {
      let ar: any[]
      let i: number
      traverseTree(data, (item, index, arr) => {
        if (item.key === dropKey) {
          ar = arr
          i = index
        }
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }
    props.treeDataSource.dataSource = data
  }
  return (
    <Fragment>
      <Header
        title={
          <TextWidget token="SettingComponents.DataSourceSetter.dataSourceTree" />
        }
        extra={
          <Button
            type="text"
            onClick={() => {
              const uuid = uid()
              const dataSource = props.treeDataSource.dataSource
              props.treeDataSource.dataSource = dataSource.concat({
                key: uuid,
                duplicateKey: uuid,
                map: [
                  {
                    label: 'label',
                    value: `${GlobalRegistry.getDesignerMessage(
                      `SettingComponents.DataSourceSetter.item`
                    )} ${dataSource.length + 1}`,
                  },
                  { label: 'value', value: uuid },
                ],
                children: [],
              })
            }}
            icon={<IconWidget infer="Add" />}
          >
            <TextWidget token="SettingComponents.DataSourceSetter.addNode" />
          </Button>
        }
      />
      <div className={`${prefix + '-layout-item-content'}`}>
        <Tree
          blockNode
          draggable
          defaultExpandAll
          defaultExpandParent
          autoExpandParent
          showLine={{ showLeafIcon: false }}
          treeData={props.treeDataSource.dataSource}
          onDragEnter={() => {}}
          onDrop={dropHandler}
          titleRender={(titleProps: INodeItem) => {
            return (
              <Title
                {...titleProps}
                treeDataSource={props.treeDataSource}
              ></Title>
            )
          }}
          onSelect={(selectedKeys) => {
            if (selectedKeys[0]) {
              props.treeDataSource.selectedKey = selectedKeys[0].toString()
            }
          }}
        ></Tree>
      </div>
    </Fragment>
  )
})
