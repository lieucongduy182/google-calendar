import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface Props {
  className?: string;
  onClick: () => void;
}

export default function ButtonForwardMonth({ className = '', onClick }: Props) {
  return (
    <button className={`${className} mx-2`} onClick={onClick}>
      <ArrowForwardIosOutlinedIcon fontSize="small" />
    </button>
  );
}
