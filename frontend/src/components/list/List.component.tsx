import {
  Box,
  Checkbox,
  Divider,
  List,
  ListItem,
  Typography
} from '@material-ui/core'
import { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { ERanobeUrls } from '../../tools/enums/Services.enum'
import { IRanobe } from '../../tools/responses/api.interface'
import style from './List.module.scss'

interface IListProps {
  ranobeList: IRanobe[]
  onCheck: (event: ChangeEvent, checked: boolean) => void
}

export default function ListComponent(props: IListProps): JSX.Element {
  return (
    <List>
      {props.ranobeList.map((ranobe, index) => {
        return (
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}
            key={index}
          >
            <Checkbox
              name={index.toString()}
              color="primary"
              checked={ranobe.checked}
              onChange={props.onCheck}
            />

            <ListItem>
              <Link
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                to={`/ranobelibme/${ranobe.href}`}
              >
                <div className={style.fit__wrap}>
                  <img
                    className={style.fit__image}
                    src={`${ERanobeUrls.STATICLIB}/${ranobe.cover}`}
                    alt={ranobe.title}
                    loading="lazy"
                  />
                </div>

                <Typography variant="h6" color="textPrimary">
                  {ranobe.title}
                </Typography>
              </Link>
            </ListItem>

            <Divider variant="fullWidth" component="li" />
          </Box>
        )
      })}
    </List>
  )
}
