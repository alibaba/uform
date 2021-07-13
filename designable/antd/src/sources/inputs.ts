import { GlobalDragSource } from '@designable/core'

GlobalDragSource.appendSourcesByGroup('inputs', [
  {
    componentName: 'DesignableField',
    props: {
      title: 'Input',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      title: 'TextArea',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      title: 'Select',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      title: 'Tree Select',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      title: 'Cascader',
      'x-decorator': 'FormItem',
      'x-component': 'Cascader',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'string | number',
      title: 'Radio Group',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'Array<string | number>',
      title: 'Checkbox Group',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      enum: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'number',
      title: 'Slider',
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'number',
      title: 'Rate',
      'x-decorator': 'FormItem',
      'x-component': 'Rate',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'string',
      title: 'DatePicker',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: '[string,string]',
      title: 'DateRangePicker',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'string',
      title: 'TimePicker',
      'x-decorator': 'FormItem',
      'x-component': 'TimePicker',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: '[string,string]',
      title: 'TimeRangePicker',
      'x-decorator': 'FormItem',
      'x-component': 'TimePicker.RangePicker',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'number',
      title: 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'string',
      title: 'Password',
      'x-decorator': 'FormItem',
      'x-component': 'Password',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'Array<string>',
      title: 'Transfer',
      'x-decorator': 'FormItem',
      'x-component': 'Transfer',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'Array<object>',
      title: 'Upload',
      'x-decorator': 'FormItem',
      'x-component': 'Upload',
      'x-component-props': {
        textContent: 'Upload',
      },
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'Array<object>',
      title: 'Drag Upload',
      'x-decorator': 'FormItem',
      'x-component': 'Upload.Dragger',
      'x-component-props': {
        textContent: 'Click or drag file to this area to upload',
      },
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'boolean',
      title: 'Switch',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
  {
    componentName: 'DesignableField',
    props: {
      type: 'object',
    },
  },
])
