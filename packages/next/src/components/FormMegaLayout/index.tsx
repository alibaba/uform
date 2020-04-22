import React from 'react'
import classnames from 'classnames'
import { normalizeCol, pickNotFormItemProps } from '../../shared'
import { createVirtualBox } from '@formily/react-schema-renderer'
import { Layout } from '@formily/react'
import styled from 'styled-components'
import { Form } from '@alifd/next'
import { computeStyle } from './style'

// 优先级：当前属性 > context 传递的属性 > 默认值
const computeAttr = (propAttr, layoutAttr, defaultValue) => {
  if (typeof propAttr !== 'undefined') return propAttr
  if (typeof layoutAttr !== 'undefined') return layoutAttr
  return defaultValue
};

const StyledLayoutItem = styled((props) => {
    const { children, itemBefore, itemAfter,
      grid, span, columns, gutter, className, autoRow, ...others } = props
    const cls = classnames({
      [className]: true,
      'mega-layout-item': true,
      'mega-layout-item-col': grid,
    });

    const finalFormItem = <Form.Item className={cls} {...others}>
      <div className="mega-layout-item-content">
        { itemBefore ? <p className="formily-mega-item-before">{itemBefore}</p> : null }
        {children}
        { itemAfter ? <p className="formily-mega-item-after">{itemAfter}</p> : null }
      </div>
    </Form.Item>    

    if (grid) {
      return <div className={cls}>
        {finalFormItem}
      </div>
    }

    return finalFormItem
})`${props => computeStyle(props)}`


const StyledLayoutWrapper = styled((props) => {
    const { gutter, ...others } = props
    return <Form.Item {...others} />
})`${props => computeStyle(props)}`

const StyledLayoutNestWrapper = styled(props => {
  const { children, seed, style, className } = props;
return <div style={style} className={classnames('mega-layout-nest-container', className, seed)}>{children}</div>
})`${props => computeStyle(props)}`

const Div = props => <div {...props} />
export const MegaLayout = styled(props => {
    const { children, itemBefore, itemAfter, description, ...others } = props
    const layoutProps = props.layoutProps || {}

    // 注意, labelCol/wrapperCol, labelWidth/wrapperWidth Layout只能透传下去
    // 自身的 labelCol/wrapperCol, labelWidth/wrapperWidth 必须通过其layoutProps来控制
    return <Layout        
        defaultSettings={{
            gutter: 20,
        }}
        {...others}
        children={(layout) => {
            const { inline, required, columns, label, labelAlign,
                grid, gutter, autoRow, span,
                full, context, isRoot, responsive
            } = layout
            let Wrapper            
            const itemProps: any = {
              inline,
              grid,
              autoRow,
              gutter,
              full,
              context,
              columns,   
              isRoot,
              isLayout: true,    
              responsive
            }
            const wrapperProps: any = {}
            if (grid) {
              Wrapper = Div // 一行
              wrapperProps.gutter = gutter // gutter
            } else {
              Wrapper = Div
            }

            if (label) {
                // 只能通过layoutProps来改动当前MegaLayout的label/wrapper相关配置
                const labelWidth = computeAttr(layoutProps.labelWidth, context.labelWidth, -1)
                const wrapperWidth = computeAttr(layoutProps.wrapperWidth, context.wrapperWidth, -1)
                const labelCol = computeAttr(layoutProps.labelCol, context.labelCol, -1)
                const wrapperCol = computeAttr(layoutProps.wrapperCol, context.wrapperCol, -1)

                if (labelCol !== -1) itemProps.labelCol = normalizeCol(labelCol)
                if (wrapperCol !== -1) itemProps.wrapperCol = normalizeCol(wrapperCol)
                if (labelWidth !== -1) itemProps.labelWidth = labelWidth
                if (wrapperWidth !== -1) itemProps.wrapperWidth = wrapperWidth
            }

            let ele = <StyledLayoutWrapper
                className={classnames(props.className, 'mega-layout-container')}
                label={label}
                required={required}
                help={description}
                labelAlign={label ? labelAlign : undefined}
                {...itemProps}
            >
                <div className="mega-layout-container-wrapper">
                    { itemBefore ? <p className="mega-layout-container-before">{itemBefore}</p> : null }
                    <Wrapper {...wrapperProps} className={classnames('mega-layout-container-content', { grid })}>
                      {children}
                    </Wrapper>
                    { itemAfter ? <p className="mega-layout-container-after">{itemAfter}</p> : null }
                </div>
            </StyledLayoutWrapper>

            if (!props.grid && grid) {   
              const seed = `nest-${Date.now()}`;
              return <StyledLayoutNestWrapper seed={seed} {...{span, columns, context, responsive}}>
                {ele}
              </StyledLayoutNestWrapper>
            }
     
            return ele
        }}
    />
})`

`;

const MegaLayoutItem = (props) => {
  const { children, schemaChildren, itemProps, ...others } = props;
  const megaProps = (schemaChildren ? others['x-mega-props'] : others['mega-props']) || {}
  return <Layout.Item {...megaProps}>
    {layoutProps => {
      const componentProps = pickNotFormItemProps(others)
      let schemaComponent = schemaChildren
      // 启用了MegaLayout
      if (layoutProps) {
        const { itemBefore, itemAfter } = megaProps
        const { columns, span, gutter, grid, inline, labelWidth, wrapperWidth, labelAlign, labelCol, wrapperCol, full,
         responsive
        } = layoutProps;
        itemProps.labelAlign = labelAlign
        itemProps.inline = inline
        itemProps.grid = grid
        itemProps.gutter = gutter
        itemProps.span = span
        itemProps.columns = columns
        itemProps.full = full
        itemProps.responsive = responsive

        if (labelCol !== -1) itemProps.labelCol = normalizeCol(labelCol)
        if (wrapperCol !== -1) itemProps.wrapperCol = normalizeCol(wrapperCol)
        if (labelWidth !== -1) itemProps.labelWidth = labelWidth
        if (wrapperWidth !== -1) itemProps.wrapperWidth = wrapperWidth
        if (itemBefore) itemProps.itemBefore = itemBefore
        if (itemAfter) itemProps.itemAfter = itemAfter

        // 撑满即为组件宽度为100%, flex: 1
        if (full) {
          componentProps.style = {
            ...(componentProps.style || {}),
            width: '100%',
            flex: 1,
          }
          
          // 处理schema的组件，因为FormItem层面没法触及到真实的组件（schema-renderer控制真正的组件注入）
          // 因此这里改动的其实是Field
          if (schemaChildren) {
            schemaComponent = React.cloneElement(schemaChildren, {
              ...schemaChildren.props,
              props: {
                ...schemaChildren.props.props,
                ['x-component-props']: {
                  ...(schemaChildren.props.props['x-component-props'] || {}),
                  style: {
                    ...componentProps.style,
                    ...(((schemaChildren.props.props['x-component-props'] || {}).style) || {}),                
                },
              }
            }})
          }          
        }
        
        return <StyledLayoutItem {...itemProps}>
          {schemaChildren ? children(schemaComponent) : children(componentProps)}
        </StyledLayoutItem>
      }

      // 没有启用MegaLayout, 保持和线上完全一致的功能。
      return children()
    }}
  </Layout.Item>
}

MegaLayout.Item = MegaLayoutItem;

export const FormMegaLayout = createVirtualBox('mega-layout', MegaLayout)

export default MegaLayout
