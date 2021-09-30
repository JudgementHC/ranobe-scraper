import { Checkbox, Container, FormControlLabel, FormGroup } from '@material-ui/core'
import { ChangeEvent, useEffect, useState } from 'react'
import ListComponent from '../../components/list/List.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'

function RanobeLibMe(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    const fetchRanobe = async () => {
      const response = (await apiAxios.get('/localRanobeList')) as IRanobe[]
      if (response) {
        response.forEach(ranobe => (ranobe.checked = false))
        setRanobeList(response)
      }
    }
    fetchRanobe()
  }, [])

  const onCheck = (event: ChangeEvent, checked: boolean) => {
    const index = event.target.getAttribute('name')
    const changedRanobeList = ranobeList.map((ranobe, i) => {
      if (index && i === +index) {
        ranobe.checked = checked
      }
      return ranobe
    })
    setRanobeList(changedRanobeList)
  }

  const checkAllChange = (event: ChangeEvent, checked: boolean) => {
    const changedRanobeList = ranobeList.map(ranobe => {
      ranobe.checked = checked
      return ranobe
    })
    setRanobeList(changedRanobeList)
    setCheckAll(checked)
  }

  return (
    <Container>
      <FormGroup>
        <FormControlLabel
          label="Check all"
          control={
            <Checkbox
              color="primary"
              checked={checkAll}
              onChange={checkAllChange}
            />
          }
        ></FormControlLabel>
      </FormGroup>

      <ListComponent onCheck={onCheck} ranobeList={ranobeList}></ListComponent>
    </Container>
  )
}

export default RanobeLibMe
