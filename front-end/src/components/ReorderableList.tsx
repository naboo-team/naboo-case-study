import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Flex, Group, List } from '@mantine/core'
import { IconArrowBigDown, IconArrowBigUp, IconArrowBigUpFilled, IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { move } from '@/utils/reorderableList.utils'


type ReorderableListProps = {
    elements: {key: string, node: ReactNode}[],
    onReorder?: (elements: {key: string, node: ReactNode}[]) => void,
}

export const ReorderableList: React.FC<ReorderableListProps> = ({ elements, onReorder }) => {

 const handleMove = (dir: 'up'|'down', index: number)  => {
    const r = move(elements, dir, index)
    onReorder?.(r)
 }

  return (
    <Group>
        {
            elements.map((element, index) => (
                <Flex direction="row" align='center' gap='md' key={element.key}>
                    <Flex direction="column" gap="1rem" justify={'center'}>
                        <IconArrowBigUpFilled onClick={() => {handleMove('up', index)}}/>
                        <IconArrowBigDown onClick={() => {handleMove('down', index)}}/>
                    </Flex>
                    {element.node}
                </Flex>
            ))
        }
    </Group>
  )
}
