import { StepTypeEnum } from '@novu/shared';
import { useParams } from 'react-router-dom';
import { ChatPreview, EmailPreview, PushPreview, SmsPreview } from '../../../components/workflow/Preview';

import { useNavigateFromEditor } from '../hooks/useNavigateFromEditor';
import { useStepIndex } from '../hooks/useStepIndex';
import { ChannelPreviewSidebar } from './ChannelPreviewSidebar';

const PreviewComponent = ({ channel }: { channel: StepTypeEnum }) => {
  switch (channel) {
    case StepTypeEnum.EMAIL:
      return <EmailPreview view="web" showVariables={false} />;

    case StepTypeEnum.TRIGGER:
      return <>TRIGGER</>;

    case StepTypeEnum.SMS:
      return <SmsPreview />;

    case StepTypeEnum.IN_APP:
      return <>IN APP</>;

    case StepTypeEnum.CHAT:
      return <ChatPreview />;

    case StepTypeEnum.PUSH:
      return <PushPreview />;

    case StepTypeEnum.DELAY:
      return <>DELAY</>;

    case StepTypeEnum.DIGEST:
      return <>DIGEST</>;

    default:
      return <>dummy</>;
  }
};

export const ChannelPreview = () => {
  const { channel } = useParams<{
    channel: StepTypeEnum | undefined;
  }>();
  const { stepIndex } = useStepIndex();

  useNavigateFromEditor(true);

  if (stepIndex === -1 || channel === undefined) {
    return null;
  }

  return (
    <>
      <ChannelPreviewSidebar>
        <PreviewComponent channel={channel} />
      </ChannelPreviewSidebar>
    </>
  );
};