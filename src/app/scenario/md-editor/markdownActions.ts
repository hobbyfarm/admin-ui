export class MDEditorAction {
  name: string;
  title?: string;
  actionBefore: string;
  actionAfter: string;
  actionEmpty: string;
  icon?: string;
}

export const ACTIONS: MDEditorAction[] = [
  {
    name: 'H',
    title: 'Heading',
    actionBefore: '# ',
    actionAfter: '',
    actionEmpty: 'Heading',
    icon: '',
  },
  {
    name: 'Bold',
    actionBefore: '**',
    actionAfter: '**',
    actionEmpty: 'Bold Text',
    icon: 'bold',
  },
  {
    name: 'Italic',
    actionBefore: '*',
    actionAfter: '*',
    actionEmpty: 'Italic Text',
    icon: 'italic',
  },
  {
    name: 'Quote',
    actionBefore: '> ',
    actionAfter: '',
    actionEmpty: 'Quote',
    icon: 'block-quote',
  },
  {
    name: 'Link',
    actionBefore: '[HobbyFarm](',
    actionAfter: ')',
    actionEmpty: 'https://github.com/hobbyfarm',
    icon: 'link',
  },
  {
    name: 'Image',
    actionBefore: '![HobbyFarm Logo](',
    actionAfter: ')',
    actionEmpty: 'https://avatars.githubusercontent.com/u/50243159',
    icon: 'image',
  },
  {
    name: 'Note',
    actionBefore: '```note:info:Read me\n',
    actionAfter: '\n```',
    actionEmpty: 'Available types: info, caution and warning',
    icon: 'note',
  },
  {
    name: 'Summary',
    actionBefore: '```hidden:Summary Text\n',
    actionAfter: '\n```',
    actionEmpty:
      'Provide a summarized text that openes a detailed view on click',
    icon: 'details',
  },
  {
    name: 'Codeblock',
    actionBefore: '```md:file.md\n',
    actionAfter: '\n```',
    actionEmpty:
      '# Syntax highlighting for\n* yaml\n* json\n* python\n* markdown\n* dockerfiles\n\noptionally provide a filename',
    icon: 'code',
  },
  {
    name: 'Nested Elements',
    actionBefore: '~~~\n',
    actionAfter: '\n~~~',
    actionEmpty:
      'Use nested elements to provide code inside note blocks etc.\n```md\n# Add "note:info" after the dashes (~) to test it.\n```',
    icon: 'tree-view',
  },
  {
    name: 'Click-To-Run',
    actionBefore: '```ctr:node1\n',
    actionAfter: '\n```',
    actionEmpty: 'echo "I get executed on node1 when a user clicks me"',
    icon: 'play',
  },
  {
    name: 'Click-To-File',
    actionBefore: '```file:yaml:name.yaml:node1\n',
    actionAfter: '\n```',
    actionEmpty: 'hello: world # Create file on click',
    icon: 'import',
  },
  {
    name: 'Session-ID',
    actionBefore: '${session}',
    actionAfter: '',
    actionEmpty: '',
    icon: 'user',
  },
  {
    name: 'VM-Info',
    actionBefore: '${vmInfo:<nodeName>:<attribute>}',
    actionAfter: '',
    actionEmpty: '',
    icon: 'host',
  },
  {
    name: 'Task',
    actionBefore: '```verifyTask:<nodeName>:<taskName>',
    actionAfter: '\n```',
    actionEmpty: '',
    icon: 'check',
  },
];
