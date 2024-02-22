import styled from '@emotion/styled';
import { Button, colors } from '@novu/design-system';
import { useSegment } from '../../../components/providers/SegmentProvider';

export const StepText = styled.p`
  display: inline;
  color: ${colors.B60};
`;

export const StepDescription = styled.div`
  line-height: 1.25rem;
  margin: 0;
`;

export const StepButton = styled(Button)`
  display: block;
`;

export function GetStartedLink({ children, ...linkProps }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link {...linkProps}>
      <StyledLink>{children}</StyledLink>
    </Link>
  );
}

export const StyledLink = styled.a`
  color: ${colors.gradientEnd};
  cursor: pointer;
`;

export function Link({ children, ...linkProps }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const segment = useSegment();

  const handleOnClick = () => {
    segment.track('Link Click - [Get Started]', { href: linkProps.href });
  };

  return (
    <StyledLink onClick={handleOnClick} {...linkProps} target="_blank" rel="noreferrer noopener">
      {children}
    </StyledLink>
  );
}
