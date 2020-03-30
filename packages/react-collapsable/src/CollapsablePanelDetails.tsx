import withStyles from '@material-ui/core/styles/withStyles';
import ExpansionPanelDetails, {ExpansionPanelDetailsProps} from '@material-ui/core/ExpansionPanelDetails';

const CollapsablePanelDetails = withStyles(() => ({
    root: {
        padding: 0,
    },
}))(ExpansionPanelDetails);

type ExtraProps = {
    variant: string
};

export type CollapsablePanelDetailsProps = ExpansionPanelDetailsProps & ExtraProps;

export default CollapsablePanelDetails