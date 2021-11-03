import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  TextField,
  Typography
} from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import { KeyboardEvent, useContext } from 'react'
import { Link } from 'react-router-dom'
import { EServiceUrls } from '../../tools/enums/Services.enum'
import { ISearchResponse } from '../../tools/interfaces/Ranobelibme.interface'
import { StoreContext } from '../../tools/store'
import { TSearchType } from '../../tools/types/Ranobelibme.type'

interface Props {
  title: string
  show: boolean
  closeEvent: () => void
  textFieldChange: (value: string) => void
  submit: () => void
  type: TSearchType
  typeChange: (type: TSearchType) => void
  result: ISearchResponse[]
}

export default function SearchComponent({
  title,
  show,
  closeEvent,
  textFieldChange,
  submit,
  type,
  typeChange,
  result
}: Props): JSX.Element {
  const onEnter = ($event: KeyboardEvent) => {
    if ($event.keyCode === 13) {
      submit()
    }
  }
  const store = useContext(StoreContext)
  const [loading] = store.loading

  return (
    <Dialog
      open={show}
      onClose={closeEvent}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        <Box display="flex" alignItems="center" mb="15px">
          <TextField
            type="search"
            label="Title"
            value={title}
            onChange={value => textFieldChange(value.target.value)}
            style={{ marginRight: 10 }}
            onKeyDown={onEnter}
          />
          <Button disabled={loading} onClick={submit}>
            Search
          </Button>
        </Box>

        <Box display="flex">
          <Button
            style={{
              marginRight: '10px',
              color: 'white',
              backgroundColor:
                type === 'manga' && !loading ? blue[800] : grey[700]
            }}
            onClick={() => typeChange('manga')}
            disabled={loading}
          >
            Ranobe
          </Button>

          <Button
            style={{
              color: 'white',
              backgroundColor:
                type === 'user' && !loading ? blue[800] : grey[700]
            }}
            onClick={() => typeChange('user')}
            disabled={loading}
          >
            User
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers={true}>
        <List>
          {result.map((item, index) => {
            const temp = {
              title: '',
              src: '',
              href: ''
            }

            if (type === 'user') {
              temp.title = item.value
              temp.src = `${EServiceUrls.RANOBELIBME}/uploads/users/${item.id}/${item.avatar}`
              temp.href = `/ranobelibme/user/${item.id}`
            } else if (type === 'manga') {
              temp.title = `${item.eng_name}\n${item.rus_name}`
              temp.src = item.covers.thumbnail
              temp.href = `/ranobelibme/ranobe/${item.slug}?title=${item.rus_name}`
            }

            return (
              <ListItem key={index} sx={{ mb: '20px', display: 'block' }}>
                <Link onClick={closeEvent} to={temp.href}>
                  <Box
                    sx={{ display: 'flex', mb: '20px', alignItems: 'center' }}
                  >
                    <img
                      style={{ marginRight: '10px', display: 'block' }}
                      src={temp.src}
                    />
                    <Typography whiteSpace="pre-wrap">{temp.title}</Typography>
                  </Box>
                </Link>

                {index !== result.length - 1 && (
                  <Divider sx={{ pt: '10px' }} variant="fullWidth" />
                )}
              </ListItem>
            )
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeEvent} variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
