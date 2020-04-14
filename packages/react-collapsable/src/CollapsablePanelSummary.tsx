import component from '@ohoareau/react-component';
import ExpansionPanelSummary, {ExpansionPanelSummaryProps} from '@material-ui/core/ExpansionPanelSummary';

const CollapsablePanelSummary = component<CollapsablePanelSummaryProps>((theme: any) => ({
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
}), ExpansionPanelSummary, undefined, {i18n: false});

type ExtraProps = {
    variant?: string
};

export type CollapsablePanelSummaryProps = ExpansionPanelSummaryProps & ExtraProps;

export default CollapsablePanelSummary