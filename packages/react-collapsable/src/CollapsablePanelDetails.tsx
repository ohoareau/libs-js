import component from '@ohoareau/react-component';
import ExpansionPanelDetails, {ExpansionPanelDetailsProps} from '@material-ui/core/ExpansionPanelDetails';

const CollapsablePanelDetails = component<CollapsablePanelDetailsProps>({
    root: {
        padding: 0,
        display: 'flex',
    },
}, ExpansionPanelDetails);

type ExtraProps = {
    variant?: string
};

export type CollapsablePanelDetailsProps = ExpansionPanelDetailsProps & ExtraProps;

export default CollapsablePanelDetails