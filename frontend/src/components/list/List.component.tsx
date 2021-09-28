import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import { ChangeEvent } from 'react'
import { ERanobeUrls } from '../../tools/enums/Services.enum'
import { IRanobe } from '../../tools/responses/api.interface'
import style from './List.module.scss'

interface IListProps {
  ranobeList: IRanobe[]
}

function ListComponent({ ranobeList }: IListProps): JSX.Element {
  const onChange = (event: ChangeEvent, checked: boolean) => {
    console.info(checked)
  }

  return (
    <List>
      {ranobeList.map((ranobe, index) => {
        return (
          <div className={style.listWrapper} key={index}>
            <Checkbox
              color="primary"
              checked={ranobe.checked}
              onChange={onChange}
            />

            <ListItem alignItems="center">
              <img
                className={style.image}
                src={`${ERanobeUrls.STATICLIB}/${ranobe.cover}`}
                alt={ranobe.title}
                loading="lazy"
              />
              <ListItemText primary={ranobe.title} />
            </ListItem>

            <Divider variant="fullWidth" component="li" />
          </div>
        )
      })}
    </List>
  )
}

export default ListComponent
