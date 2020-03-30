import withStyles from '@material-ui/core/styles/withStyles';
import ExpansionPanelSummary, {ExpansionPanelSummaryProps} from '@material-ui/core/ExpansionPanelSummary';

const CollapsablePanelSummary = withStyles((theme: any) => ({
    root: {
        backgroundColor: (props: CollapsablePanelSummaryProps) => props.variant === 'dark' ? (theme.palette.header || theme.palette.primary).dark : (theme.palette.header || theme.palette.primary).main,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}))(ExpansionPanelSummary);

type ExtraProps = {
    variant?: string
};

export type CollapsablePanelSummaryProps = ExpansionPanelSummaryProps & ExtraProps;

export default CollapsablePanelSummary