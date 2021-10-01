import { Box, Checkbox, Grid, List, ListItem } from '@material-ui/core'
import { ChangeEvent } from 'react'
import { Chapter } from '../../tools/responses/api.interface'

interface IListProps {
  chapterList: Chapter[]
  onCheck: (event: ChangeEvent, checked: boolean) => void
}

export default function ChapterListComponent(props: IListProps): JSX.Element {
  return (
    <List>
      {props.chapterList.map((chapter, index) => {
        return (
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}
            key={index}
          >
            <Checkbox
              name={index.toString()}
              color="primary"
              checked={chapter.checked}
              onChange={props.onCheck}
            />

            <ListItem divider={true}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {chapter.title}
                </Grid>

                <Grid item xs={3}>
                  {chapter.author}
                </Grid>

                <Grid item xs={1}>
                  {chapter.date}
                </Grid>
              </Grid>
            </ListItem>
          </Box>
        )
      })}
    </List>
  )
}
