import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

interface Props {
  className?: string;
  onClick: () => void;
}

export default function ButtonPrevMonth({ className = '', onClick }: Props) {
  return (
    <button className={`${className} mx-2`} onClick={onClick}>
      <ArrowBackIosOutlinedIcon fontSize="small" />
    </button>
  );
}
