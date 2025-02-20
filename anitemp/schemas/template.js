import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'template',
  title: 'Template',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Template Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'text'
    }),
    defineField({
      name: 'downloads',
      title: 'Downloads',
      type: 'number'
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number'
    }),
    defineField({
      name: 'new',
      title: 'New Template',
      type: 'boolean'
    }),
    defineField({
      name: 'tags',
      title: 'Tags of Template',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'preview',
      title: 'Template Preview',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*'
              }
            },
          ]
        }
      ]
    }),
    defineField({
      name: 'texts',
      title: 'Text Elements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'content',
              title: 'Content',
              type: 'text'
            },
            {
              name: 'position',
              title: 'Position',
              type: 'object',
              fields: [
                {name: 'x', type: 'number', title: 'X Position'},
                {name: 'y', type: 'number', title: 'Y Position'}
              ]
            },
            {
              name:'duration',
              title: 'For what Duration (seconds)',
              type: 'number'
            },
            {
              name:'startsat',
              title: 'Starts at what Duration (seconds)',
              type: 'number'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'transitions',
      title: 'Transitions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Transition Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Fade', value: 'fade'},
                  {title: 'Dissolve', value: 'dissolve'},
                  {title: 'Wipe', value: 'wipe'},
                  {title: 'Slide', value: 'slide'}
                ]
              }
            },
            {
              name: 'duration',
              title: 'Duration (seconds)',
              type: 'number'
            }
          ]
        }
      ]
    })
  ]
})