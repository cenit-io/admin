import React, { useRef } from 'react';
import ActionRegistry from "./ActionRegistry";
import FormEditor from "../components/FormEditor";
import { DataType } from "../services/DataTypeService";
import API from "../services/ApiService";
import SuccessAlert from "./SuccessAlert";
import DoneIcon from "@material-ui/icons/Done";
import { Config } from "../common/Symbols";
import { FormRootValue } from "../services/FormValue";
import UpdateIcon from "@material-ui/icons/SystemUpdateAlt";
import { useContainerContext } from "./ContainerContext";

function SuccessUpdate() {
    return (
        <SuccessAlert mainIcon={DoneIcon}/>
    );
}

function updateDataTypeFormFor(sourceDataType) {
    const dt = DataType.from({
        name: 'Update',
        schema: {
            type: 'object',
            properties: {
                updater: {
                    referenced: true,
                    $ref: {
                        namespace: 'Setup',
                        name: 'UpdaterTransformation'
                    }
                }
            }
        }
    });

    dt[Config] = {
        fields: {
            updater: {
                selector: {
                    $or: [
                        { source_data_type_id: { $exists: false } },
                        { source_data_type_id: sourceDataType.id }
                    ]
                }
            }
        }
    };

    return dt;
}

const Update = ({ docked, dataType, onSubjectPicked, height }) => {

    const [containerState] = useContainerContext();

    const { selectedItems } = containerState;

    const value = useRef(new FormRootValue({
        data_type: {
            id: dataType.id,
            _reference: true
        },
        selector: selectedItems.length
            ? { _id: { $in: selectedItems.map(({ id }) => id) } }
            : {}
    }));

    const formDataType = useRef(updateDataTypeFormFor(dataType));

    const handleFormSubmit = (_, value) => {
        const { data_type, selector, updater } = value.get();
        return API.post('setup', 'updater_transformation', updater.id, 'digest', {
            data_type,
            selector
        });
    };

    return (
        <div className="relative">
            <FormEditor docked={docked}
                        dataType={formDataType.current}
                        height={height}
                        submitIcon={<UpdateIcon/>}
                        onFormSubmit={handleFormSubmit}
                        onSubjectPicked={onSubjectPicked}
                        successControl={SuccessUpdate}
                        value={value.current}/>
        </div>
    );
};

export default ActionRegistry.register(Update, {
    bulkable: true,
    icon: UpdateIcon,
    title: 'Update'
});
