import axios from "axios"
import { ChangeEvent, useContext, useState } from "react"
import { alarmPresetsAPI } from "../constants/urls"
import { fetchAlarmPresets } from "../Functions/Functions"
import { AlarmPresetsListItem } from "../Molecules/AlarmPresetsListItem"
import { ControlledAlarmSetterWithLabel, ControlledTaskSelecterWithLabel, submitButton, taskInverter } from "../Molecules/Form"
import { AlarmPresetsContext } from "../providers/AlarmPresetsProvider"
import { AlarmPresetsListItemType } from "../types/types"

export const AlarmPresetEdit = () => {
  const { setAlarmPresets } = useContext(AlarmPresetsContext);
  const [correctPreset, setCorrectPreset] = useState<AlarmPresetsListItemType>({
    id: undefined,
    presetName: "",
    wakeAt: undefined,
    task: undefined
  })

  const onPresetNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCorrectPreset({
      ...correctPreset,
      presetName: e.target.value
    })
  }

  const onHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCorrectPreset({
      ...correctPreset,
      wakeAt: correctPreset.wakeAt?.hour(parseInt(e.target.value, 10))
    })
  }

  const onMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCorrectPreset({
      ...correctPreset,
      wakeAt: correctPreset.wakeAt?.minute(parseInt(e.target.value, 10))
    })
  }

  const onTaskChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCorrectPreset({
      ...correctPreset,
      task: taskInverter(e.target.value) 
    })
  }

  const patchPreset = () => {
    axios.patch(`${alarmPresetsAPI}/${correctPreset.id}`,
    {
      preset_name: correctPreset.presetName,
      wake_at: correctPreset.wakeAt,
      task: correctPreset.task
    },
    { withCredentials: true })
    .then(res => {
      console.log(res)
      fetchAlarmPresets(setAlarmPresets)
    })
    .catch(e => console.log(e))
  }

  return (<>
    <div className="flex w-full justify-between text-center">
      <div className="w-1/4 select-none">
        プリセット
      </div>
      <div className="w-3/4">
        <div className="w-full flex justify-between bg-gray-100 dark:bg-gray-800 select-none">
          <div className="w-1/3 border border-gray-300 py-2">タイトル</div>
          <div className="w-1/3 border-y border-r border-gray-300 py-2">起床時刻</div>
          <div className="w-1/3 border-y border-r border-gray-300 py-2">停止方法</div>
        </div>
        <ul className="bg-gray-50 dark:bg-gray-700 h-40 overflow-y-scroll shadow-inner shadow-gray-300/75 dark:shadow-gray-800 mb-4">
          <AlarmPresetsListItem correctPreset={ correctPreset } setCorrectPreset={ setCorrectPreset } />
        </ul>
      </div>
    </div>
    <div className="w-full text-center mb-2">
      <label htmlFor="title" className="w-1/4 inline-block select-none">タイトル</label>
      <input type="text" name="title" id="title" className="border w-3/4 px-2 dark:bg-inherit" value={ correctPreset.presetName } onChange={ onPresetNameChange } />
    </div>
    <div className="w-full justify-between text-center mb-2">
      { ControlledAlarmSetterWithLabel("起床時刻", "wakeAt", "wakeAt", onHourChange, onMinuteChange, correctPreset.wakeAt) }
    </div>
    <div className="w-full mb">
      { ControlledTaskSelecterWithLabel("停止方法", "task", "task", correctPreset.task, onTaskChange) }
    </div>
    <div className="w-full justify-between text-center">
      { submitButton("変更", patchPreset) }
    </div>
  </>
  )
}