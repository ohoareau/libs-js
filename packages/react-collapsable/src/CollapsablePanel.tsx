import withStyles from '@material-ui/core/styles/withStyles';
import ExpansionPanel, {ExpansionPanelProps} from '@material-ui/core/ExpansionPanel';

const CollapsablePanel = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            '&:first-child': {
            },
        },
    },
    expanded: {},
})(ExpansionPanel);

type ExtraProps = {
};

export type CollapsablePanelProps = ExpansionPanelProps & ExtraProps;

export default CollapsablePanel